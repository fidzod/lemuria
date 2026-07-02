import type { SessionMap } from "./types";
import data from './data/posts.yaml';
import { api } from "./api";
import type { Post } from "@lemuria/types";

const posts: string[] = data.posts;

export const createPosts = async (sessionMap: SessionMap, parentIds: string[] = []) => {
  const createdPosts = await Promise.all(posts.map(async p => {
    const usernames = sessionMap.keys().toArray();
    const user = usernames[Math.floor(Math.random() * usernames.length)]!;
    const cookie = sessionMap.get(user)!.session;
    const form = new FormData();
    form.append('textContent', p);
    if (parentIds.length > 0) {
      const parentId = parentIds[Math.floor(Math.random() * parentIds.length)]!;
      form.append('parentId', parentId);
    }
    const res = await fetch(api('/posts'), {
      method: 'POST',
      headers: { Cookie: cookie },
      body: form,
    })
    const data: {
      success: boolean;
      data: Post;
    } = await res.json() as any;
    if (!data.success) throw new Error("Failed to post")
    if (parentIds.length > 0) {
      console.log(`@${user} commented on ${form.get('parentId')}`)
    } else {
      console.log(`@${user} posted`);
    }
    return data.data.id;
  }));
  return createdPosts;
}
