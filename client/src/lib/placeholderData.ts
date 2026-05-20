import Avatar1 from '$lib/assets/users/avatar1.jpg';
import Avatar2 from '$lib/assets/users/avatar2.jpg';
import Avatar3 from '$lib/assets/users/avatar3.jpg';
import Avatar4 from '$lib/assets/users/avatar4.png';
import Avatar5 from '$lib/assets/users/avatar5.jpg';

export const boards = [
	{
		mnemonic: 'ooo',
		name: 'Object-oriented Ontology',
		description:
			'A school of thought that rejects the privileging of human existence over the existence of nonhuman objects.'
	},
	{
		mnemonic: 'ccru',
		name: 'Cybernetic Culture Research Unit',
		description:
			'An experimental philosophy and theory collective that operated at the University of Warwick in the 1990s.'
	},
	{
		mnemonic: 'ct',
		name: 'Critical Theory',
		description:
			'A social-philosophical tradition that examines and critiques society and culture through the lens of power, ideology, and emancipation.'
	},
	{
		mnemonic: 'del',
		name: 'Deleuze',
		description:
			'The philosophy of Gilles Deleuze, a French thinker known for concepts such as difference, becoming, and the rhizome.'
	},
	{
		mnemonic: 'cy',
		name: 'Cyberpunk',
		description:
			'A science fiction subgenre set in a dystopian future marked by advanced technology, corporate dominance, and countercultural resistance.'
	},
	{
		mnemonic: 'mu',
		name: 'Music',
		description:
			'An art form consisting of organized sound, encompassing composition, performance, and the cultural contexts in which it is produced.'
	},
	{
		mnemonic: 'm',
		name: 'Movies',
		description:
			'A form of visual storytelling that uses moving images and sound to explore narrative, emotion, and aesthetics.'
	},
	{
		mnemonic: 'rust',
		name: 'Rust',
		description:
			'A systems programming language focused on safety, performance, and concurrency, developed by Mozilla Research.'
	},
	{
		mnemonic: 'e',
		name: 'Electronic Music',
		description:
			'Music produced using electronic instruments and technology, encompassing genres from ambient and techno to noise and experimental.'
	},
	{
		mnemonic: 'oc',
		name: 'Occultism',
		description:
			'A range of esoteric beliefs and practices concerned with hidden or supernatural forces, including magic, divination, and mysticism.'
	},
	{
		mnemonic: 'p',
		name: 'Programming',
		description:
			'The practice of writing instructions for computers to execute, spanning software engineering, algorithms, and computer science.'
	},
	{
		mnemonic: 'gm',
		name: 'Gaming',
		description:
			'The practice of playing video games, encompassing game design, culture, criticism, and competitive play.'
	},
	{
		mnemonic: 'nw',
		name: 'News & Current Affairs',
		description:
			'The ongoing coverage and discussion of contemporary events, politics, and developments around the world.'
	}
];

export const posts = [
	{
		displayName: 'Wintermute',
		username: 'br34k',
		createdAt: '2 hours ago',
		reshares: 128,
		votes: 1201,
		replies: 427,
		body: `
            Now he slept in the cheapest coffins, the ones nearest the
            port, beneath the quartz-halogen floods that lit the docks all
            night like vast stages; where you couldn't see the lights of
            Tokyo for the glare of the television sky, not even the towering
            hologram logo of the Fuji Electric Company, and Tokyo Bay
            was a black expanse where gulls wheeled above drifting shoals
            of white styrofoam.
        `,
		avatar: Avatar3,
		color: 'cyan'
	},
	{
		displayName: 'Case',
		username: 'zero',
		createdAt: '1 hour ago',
		reshares: 12,
		votes: 100,
		replies: 26,
		body: `
			The dreams came on in the Japanese night like live wire voodoo and he'd cry for it, cry in his
			sleep, and wake alone in the dark, curled in his capsule in some coffin hotel, his hands
			clawed into the bedslab, temper foam bunched between his fingers, trying to reach the console
			that wasn't there.
        `,
		avatar: Avatar1,
		color: 'red'
	},
	{
		displayName: 'Molly',
		username: 'mirr0red',
		createdAt: '1 hour ago',
		reshares: 3,
		votes: 68,
		replies: 91,
		body: `
            The Japanese had already forgotten more neurosurgery than
            the Chinese had ever known. The black clinics of Chiba were
            the cutting edge, whole bodies of technique supplanted monthly.
        `,
		avatar: Avatar2,
		color: 'yellow'
	},
	{
		displayName: 'Maelcum',
		username: 'mael',
		createdAt: '2 hours ago',
		reshares: 51,
		votes: 201,
		replies: 343,
		body: `
            Night City, with Ninsei its heart.
            By day, the bars down Ninsei were shuttered and featureless,
            the neon dead, the holograms inert, waiting, under the poisoned
            silver sky.
        `,
		avatar: Avatar4,
		color: 'green'
	},
	{
		displayName: 'Kuomintang',
		username: 'revelations33',
		createdAt: '5 hours ago',
		reshares: 2,
		votes: 11,
		replies: 4,
		body: `
            It took a month for the gestalt of drugs and tension he moved
            through to turn those perpetually startled eyes into wells of
            reflexive need. He'd watched her personality fragment, calving
            like an iceberg, splinters drifting away, and finally he'd seen
            the raw need, the hungry armature of addiction.
        `,
		avatar: Avatar5,
		color: 'magenta'
	}
];
