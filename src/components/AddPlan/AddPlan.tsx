import { useState } from "react"
import styles from "./AddPlan.module.css"

type Props = {
	addPlan: (name: string) => void
}

export default function AddPlan({ addPlan }: Props) {
	const [status, setStatus] = useState<string>("")

	function handleSubmit(
		e: React.FormEvent<HTMLFormElement> & { target: HTMLFormElement }
	) {
		e.preventDefault()
		const formData = new FormData(e.target)
		const name = formData.get("name") as string
		if (!name) return
		addPlan(name)
		e.target.reset()
		setStatus("added")
		setTimeout(() => setStatus(""), 1000)
	}

	return (
		<>
			<div aria-live='polite' className='sr-only'>
				{status}
			</div>

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
		</>
	)
}
