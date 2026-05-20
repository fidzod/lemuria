<script lang="ts">
	const tags = [
		'philosophy',
		'gnosticism',
		'thursday',
		'object oriented ontology',
		'donald trump',
		'apple',
		'golden dawn'
	];
</script>

<h1>Trending Tags</h1>

<ul>
	{#each tags as tag}
		<li><a href="/" class="tag">{tag}</a></li>
	{/each}
</ul>
