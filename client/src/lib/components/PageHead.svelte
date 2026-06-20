<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Stats } from '@lemuria/types';

	let { stats }: { stats: Stats | null } = $props();

	const CELL_W = 10;
	const CELL_H = 14;
	const CANVAS_H = 100;
	const CHARS = '·.:-+*=%#@$?!/\\|[]{}()<>';
	const CHAR_CYCLE_RATE = 0.015;
	const PHASE_DURATION = { forming: 1.5, hold: 3.0, dissolving: 2.0, idle: 0 };

	type TextOption = { lines: string[]; rare: boolean };

	const TEXT_OPTIONS: TextOption[] = [
		{ lines: ['lemuria.so'], rare: false },
		{
			lines: ['The sky above the port was the color of television,', 'tuned to a dead channel.'],
			rare: false
		},
		{
			lines: [`${stats?.onlineUsers} online user${stats?.onlineUsers !== 1 ? 's' : ''}`],
			rare: false
		},
		{ lines: [`${stats?.uploadsSize} uploaded`], rare: false },
		{ lines: [`${stats?.totalPosts} posts`], rare: false }
	];

	const RARE_OPTIONS: TextOption[] = [
		{
			lines: [
				"We're trapped in the belly",
				'of this horrible machine,',
				'and the machine is bleeding to death.'
			],
			rare: true
		},
		{
			lines: [
				'Even though a hedgehog may want to become close with',
				'another hedgehog. The closer they get the more they injure each',
				'other with their spines.'
			],
			rare: true
		},
		{
			lines: ['"I didn\'t have a choice! They made me pilot the stupid thing!"'],
			rare: true
		}
	];

	type Cell = { char: string; brightness: number };
	type EventPhase = 'forming' | 'hold' | 'dissolving' | 'idle';
	type TextEvent = { phase: EventPhase; t: number; cells: Map<number, string> };

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let cols = 0;
	let rows = 0;
	let cells: Cell[][] = [];
	let offsetX = 0;
	let frameId: number;
	let lastTs = 0;
	let textEvents: TextEvent[] = [];
	let textOptionIndex = 0;

	const randomChar = (): string => CHARS[Math.floor(Math.random() * CHARS.length)]!;

	const buildCells = (width: number) => {
		cols = Math.floor(width / CELL_W);
		rows = Math.floor(CANVAS_H / CELL_H);
		offsetX = (width - cols * CELL_W) / 2;
		cells = Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => ({ char: randomChar(), brightness: 0 }))
		);
	};

	const BLOBS = Array.from({ length: 35 }, () => ({
		x: Math.random(),
		y: Math.random(),
		vx: (Math.random() - 0.5) * (0.1 + Math.random() * 0.01),
		vy: (Math.random() - 0.5) * (0.1 + Math.random() * 0.01),
		opacity: Math.random(),
		vOpacity: (Math.random() - 0.5) * 0.8
	}));

	const makeTextCells = (
		lines: string[],
		startCol: number,
		startRow: number
	): Map<number, string> => {
		const map = new Map<number, string>();
		for (let li = 0; li < lines.length; li++) {
			const line = lines[li]!;
			const r = startRow + li;
			if (r >= rows) continue;
			for (let i = 0; i < line.length; i++) {
				const c = startCol + i;
				if (c >= cols) continue;
				map.set(r * cols + c, line[i]!);
			}
		}
		return map;
	};

	const eventOverlaps = (startCol: number, startRow: number, option: TextOption): boolean => {
		const padding = 2;
		const eventWidth = Math.max(...option.lines.map((l) => l.length));
		const eventHeight = option.lines.length;
		for (const e of textEvents) {
			let minR = Infinity,
				maxR = -Infinity,
				minC = Infinity,
				maxC = -Infinity;
			for (const key of e.cells.keys()) {
				const r = Math.floor(key / cols);
				const c = key % cols;
				minR = Math.min(minR, r);
				maxR = Math.max(maxR, r);
				minC = Math.min(minC, c);
				maxC = Math.max(maxC, c);
			}
			const noOverlap =
				startCol > maxC + padding ||
				startCol + eventWidth < minC - padding ||
				startRow > maxR + padding ||
				startRow + eventHeight < minR - padding;
			if (!noOverlap) return true;
		}
		return false;
	};

	const spawnEvent = () => {
		const wrappedIndex = textOptionIndex % TEXT_OPTIONS.length;
		const option =
			wrappedIndex === 0 && textOptionIndex > 0 && Math.random() < 0.2
				? RARE_OPTIONS[Math.floor(Math.random() * RARE_OPTIONS.length)]!
				: TEXT_OPTIONS[wrappedIndex]!;
		const maxWidth = Math.max(...option.lines.map((l) => l.length));
		const margin = 1;
		for (let attempt = 0; attempt < 10; attempt++) {
			const startCol = margin + Math.floor(Math.random() * (cols - maxWidth - margin * 2));
			const startRow =
				margin + Math.floor(Math.random() * (rows - option.lines.length - margin * 2));
			if (startCol < 0 || startRow < 0) continue;
			if (eventOverlaps(startCol, startRow, option)) continue;
			textEvents.push({
				phase: 'forming',
				t: 0,
				cells: makeTextCells(option.lines, startCol, startRow)
			});
			if (!option.rare) textOptionIndex++;
			return;
		}
	};

	const updateBlobs = (dt: number) => {
		for (const b of BLOBS) {
			b.x += b.vx * dt;
			b.y += b.vy * dt;
			if (b.x < 0 || b.x > 1) b.vx *= -1;
			if (b.y < 0 || b.y > 1) b.vy *= -1;
			b.opacity += b.vOpacity * dt;
			if (b.opacity < 0 || b.opacity > 1) b.vOpacity *= -1;
			b.opacity = Math.max(0, Math.min(1, b.opacity));
		}
	};

	const noise = (c: number, r: number): number => {
		const x = c / cols;
		const y = r / rows;
		let v = 0;
		for (const b of BLOBS) {
			const dx = (x - b.x) * (cols / rows);
			const dy = y - b.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			v += Math.max(0, 1 - dist / 0.4) * b.opacity;
		}
		return Math.min(v, 1);
	};

	const updateEvents = (dt: number) => {
		if (Math.random() < dt * 0.4) spawnEvent();
		for (const e of textEvents) {
			e.t += dt / PHASE_DURATION[e.phase];
			if (e.t >= 1) {
				e.t = 0;
				if (e.phase === 'forming') e.phase = 'hold';
				else if (e.phase === 'hold') e.phase = 'dissolving';
				else if (e.phase === 'dissolving') e.phase = 'idle';
			}
		}
		textEvents = textEvents.filter((e) => e.phase !== 'idle');
	};

	const update = (dt: number) => {
		updateBlobs(dt);
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const cell = cells[r]![c]!;
				cell.brightness = noise(c, r);
				if (Math.random() < CHAR_CYCLE_RATE + cell.brightness * 0.04) {
					cell.char = randomChar();
				}
			}
		}
	};

	const draw = () => {
		const ctx = canvas.getContext('2d')!;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${CELL_H - 2}px monospace`;
		ctx.textBaseline = 'top';
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const { char, brightness } = cells[r]![c]!;
				const key = r * cols + c;
				let drawn = false;
				for (const e of textEvents) {
					const textChar = e.cells.get(key);
					if (textChar) {
						const tb = e.phase === 'forming' ? e.t : e.phase === 'hold' ? 1 : 1 - e.t;
						const lock =
							e.phase === 'forming'
								? e.t * e.t
								: e.phase === 'dissolving'
									? (1 - e.t) * (1 - e.t)
									: 1;
						const displayChar = lock > 0.95 ? textChar : char;
						const v = Math.floor(tb * 255);
						ctx.fillStyle = `rgb(${v},${v},${v})`;
						ctx.fillText(displayChar, offsetX + c * CELL_W, r * CELL_H);
						drawn = true;
						break;
					}
				}
				if (!drawn) {
					const v = Math.floor(18 + brightness * 180);
					ctx.fillStyle = `rgb(${v},${v},${v})`;
					ctx.fillText(char, offsetX + c * CELL_W, r * CELL_H);
				}
			}
		}
	};

	const loop = (ts: number) => {
		const dt = lastTs ? (ts - lastTs) / 1000 : 0;
		lastTs = ts;
		updateEvents(dt);
		update(dt);
		draw();
		frameId = requestAnimationFrame(loop);
	};

	const resize = (width: number) => {
		canvas.width = width;
		canvas.height = CANVAS_H;
		buildCells(width);
		textEvents = [];
		textOptionIndex = 0;
	};

	onMount(() => {
		if (!browser) return;
		resize(container.offsetWidth);
		frameId = requestAnimationFrame(loop);

		const observer = new ResizeObserver((entries) => {
			resize(Math.floor(entries[0]!.contentRect.width));
		});
		observer.observe(container);

		return () => {
			cancelAnimationFrame(frameId);
			observer.disconnect();
		};
	});
</script>

<div bind:this={container} style="position:relative; height:{CANVAS_H}px;">
	<canvas bind:this={canvas} style="position:absolute; top:0; left:0;"></canvas>
</div>
