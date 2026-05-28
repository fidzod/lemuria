<script lang="ts">
    import {
        House as Home,
        Bell as Notifications,
        Search,
        FolderTree as Boards,
        LifeBuoy as Help,
        MessageCircleQuestionMark as ContactUs,
        Bitcoin as Donate
    } from '@lucide/svelte/icons';
	import { UNREAD_NOTIFICATIONS_COUNT_KEY } from '$lib/context';
	import { getContext } from 'svelte';

	const getUnreadNotificationsCount = getContext<() => number>(UNREAD_NOTIFICATIONS_COUNT_KEY);
</script>

<h1>Menu</h1>

<ul>
	<li id="active"><a href="/">[<Home/>] Home</a></li>
	<li><a href="/notifications">[<Notifications/>] Notifications ({getUnreadNotificationsCount()})</a></li>
	<li><a href="/">[<Search/>] Search</a></li>
	<li><a href="/">[<Boards/>] Boards</a></li>
	<div class="separator"></div>
	<li><a href="/">[<Help/>] Help</a></li>
	<li><a href="/">[<ContactUs/>] Contact Us</a></li>
	<li><a href="/">[<Donate/>] Donate or sponsor</a></li>
</ul>

<style>
	li#active a {
		color: var(--text-primary);
	}

    li a {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
    }

	.separator {
		width: 100%;
		border-bottom: 1px solid var(--border-subtle);
		margin: var(--space-xs) 0;
	}
</style>
