import { auth, currentUser } from "@clerk/nextjs/server";

/** Server-side Strapi base URL (use Docker service name when frontend runs in Compose). */
const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/** Strapi 5 REST wraps lists in `{ data: [] }`; older code used a raw array. */
function unpackUserList(json) {
  if (Array.isArray(json)) return json;
  if (json?.data && Array.isArray(json.data)) return json.data;
  return [];
}

/** Create/register responses sometimes wrap the user. */
function unpackUserRecord(json) {
  if (!json) return null;
  if (json.user) return json.user;
  if (json.data && !Array.isArray(json.data)) return json.data;
  return json;
}

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  if (!STRAPI_API_TOKEN) {
    console.error("STRAPI_API_TOKEN missing in env");
    return null;
  }

  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  try {
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.error("Strapi GET /users:", existingUserResponse.status, errorText);
      return null;
    }

    const rawList = await existingUserResponse.json();
    const users = unpackUserList(rawList);

    if (users.length > 0) {
      const existingUser = users[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        const userKey = existingUser.documentId ?? existingUser.id;
        await fetch(`${STRAPI_URL}/api/users/${userKey}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }

      return { ...existingUser, subscriptionTier };
    }

    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    const rolesData = await rolesResponse.json();
    const roleList = rolesData.roles ?? rolesData.data ?? [];
    const authenticatedRole = roleList.find(
      (role) => role.type === "authenticated"
    );

    if (!authenticatedRole) {
      console.error("Strapi: authenticated role missing");
      return null;
    }

    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
    };

    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    if (!newUserResponse.ok) {
      const errorText = await newUserResponse.text();
      console.error("Strapi POST /users:", newUserResponse.status, errorText);
      return null;
    }

    const created = await newUserResponse.json();
    return unpackUserRecord(created);
  } catch (error) {
    const cause = error?.cause;
    const detail =
      cause && typeof cause === "object"
        ? `${cause.code ?? ""} ${cause.syscall ?? ""} ${cause.address ?? ""}:${cause.port ?? ""}`.trim()
        : cause != null
          ? String(cause)
          : "";
    console.error(
      "checkUser: Strapi unreachable —",
      error.message,
      detail ? `(${detail})` : "",
      "| NEXT_PUBLIC_STRAPI_URL =",
      STRAPI_URL,
      "| Is Strapi running and reachable from this machine?"
    );
    return null;
  }
};
