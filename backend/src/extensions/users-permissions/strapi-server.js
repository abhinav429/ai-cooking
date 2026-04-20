"use strict";

/**
 * Strapi 5 validates Content API responses for plugin::users-permissions.user
 * against a fixed Zod schema that requires `publishedAt` to be a string.
 * Extended users often use draftAndPublish: false, so sanitized output has
 * `publishedAt: null` and GET /api/users (and related actions) return 500.
 *
 * Normalize the payload so it matches the route response contract.
 */
function normalizeUserForContentApiResponse(user) {
  if (!user || typeof user !== "object") return user;
  const out = { ...user };
  if (out.publishedAt == null) out.publishedAt = "";
  else out.publishedAt = String(out.publishedAt);
  if (out.role === null) delete out.role;
  return out;
}

module.exports = (plugin) => {
  const user = plugin.controllers.user;

  const wrap = (name) => {
    const original = user[name];
    if (typeof original !== "function") return;
    user[name] = async (ctx) => {
      await original(ctx);
      if (name === "find" && Array.isArray(ctx.body)) {
        ctx.body = ctx.body.map(normalizeUserForContentApiResponse);
      } else if (
        (name === "findOne" ||
          name === "me" ||
          name === "create" ||
          name === "update" ||
          name === "destroy") &&
        ctx.body
      ) {
        ctx.body = normalizeUserForContentApiResponse(ctx.body);
      }
    };
  };

  wrap("find");
  wrap("findOne");
  wrap("me");
  wrap("create");
  wrap("update");
  wrap("destroy");

  return plugin;
};
