import type { PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
  const postId = Number(params.id);
  const commentsRes = await api.comments.get(withCookies(fetch, request), postId);
  const postRes = await api.posts.get(withCookies(fetch, request), postId);

  if (!postRes.success) error(404, "Post not found.")

  return {
    comments: commentsRes.success ? commentsRes.data : [],
    post: postRes.data
  };
};
