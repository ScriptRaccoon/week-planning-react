import { useState } from "react"
import styles from "./AddPlan.module.css"

type Props = {
	add: (name: string) => void
}

export default function AddPlan({ add }: Props) {
	const [status, setStatus] = useState<string>("")
	const [name, setName] = useState<string>("")

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (!name) return
		add(name)
		setName("")
		setStatus("added")
		setTimeout(() => setStatus(""), 1000)
	}

	return (
		<>
			<div aria-live='polite' className='sr-only'>
				{status}
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<label
					className={`label ${styles.inputLabel}`}
					htmlFor='nameInput'
				>
					What do you plan this week?
				</label>
				<input
					type='text'
					className={`input ${styles.nameInput}`}
					id='nameInput'
					autoComplete='off'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button className='button big'>Add</button>
			</form>
		</>
	)
}
