import styles from "./AddPlan.module.css"

type Props = {
	addPlan: (name: string) => void
}

export default function AddPlan({ addPlan }: Props) {
	function handleSubmit(
		e: React.FormEvent<HTMLFormElement> & { target: HTMLFormElement }
	) {
		e.preventDefault()
		const formData = new FormData(e.target)
		const name = formData.get("name") as string
		addPlan(name)
		e.target.reset()
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<label className={`label ${styles.inputLabel}`} htmlFor='nameInput'>
				What do you plan this week?
			</label>
			<input
				type='text'
				className={`input ${styles.nameInput}`}
				id='nameInput'
				name='name'
				autoComplete='off'
			/>
			<button className='button big'>Add</button>
		</form>
	)
}
