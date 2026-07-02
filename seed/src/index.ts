import { createFriendships } from "./friendships";
import { createLikes } from "./likes";
import { createPosts } from "./posts";
import { createSessions, updateProfiles } from "./users";

const main = async () => {
  console.log("Registering users...");
  const sessionMap = await createSessions();

  console.log("Updating profiles...");
  await updateProfiles(sessionMap);

  console.log("Creating posts...");
  const createdPosts = await createPosts(sessionMap);

  console.log("Creating comments...");
  const createdComments = await createPosts(sessionMap, createdPosts);

  console.log("Liking posts and comments...");
  await createLikes(sessionMap, createdPosts.concat(createdComments));

  console.log("Creating friendships...");
  await createFriendships(sessionMap);
};

main();
