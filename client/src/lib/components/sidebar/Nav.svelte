<script lang="ts">
	import {
		House as Home,
		Bell as Notifications,
		CircleUserRound as YourProfile,
		Search,
		FolderTree as Boards,
		LifeBuoy as Help,
		MessageCircleQuestionMark as ContactUs,
		Bitcoin as Donate
	} from '@lucide/svelte/icons';
	import { UNREAD_NOTIFICATIONS_COUNT_KEY, USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
	import type { PublicUser } from '@lemuria/types';
	import { page } from '$app/state';

	const getUnreadNotificationsCount = getContext<() => number>(UNREAD_NOTIFICATIONS_COUNT_KEY);
	let unreadNotifications = $derived(getUnreadNotificationsCount());

	const getUser = getContext<() => PublicUser>(USER_KEY);
	let user = $derived(getUser());
</script>

<ul>
	<li class:active={page.url.pathname === '/'}><a href="/"><Home />Home</a></li>
	{#if user}
		<li
			class="notifications"
			class:hasUnread={unreadNotifications > 0}
			class:active={page.url.pathname === '/notifications'}
		>
			<a href="/notifications">
				<Notifications />Notifications
				{#if unreadNotifications > 0}<span>{unreadNotifications}</span>{/if}
			</a>
		</li>
		<li class:active={page.url.pathname === `/@${user.username}`}>
			<a href="/@{user.username}"><YourProfile />Your Profile</a>
		</li>
	{/if}
	<li class:active={page.url.pathname === '/search'}>
		<a href="/search"><Search />Search</a>
	</li>
	<li class:active={page.url.pathname === '/boards'}>
		<a href="/boards"><Boards />Boards</a>
	</li>
	<li class:active={page.url.pathname === '/support'}>
		<a href="/support"><Help />Help</a>
	</li>
	<li><a href="mailto:fidzod@lemuria.so"><ContactUs />Contact Us</a></li>
	<li class:active={page.url.pathname === '/donate'}>
		<a href="/donate"><Donate />Donate or sponsor</a>
	</li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.active a {
		color: var(--text-primary);
	}
	li a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
	}
	.notifications {
		span {
			margin-left: auto;
		}
		&.hasUnread span {
			color: var(--text-primary);
		}
	}
</style>
