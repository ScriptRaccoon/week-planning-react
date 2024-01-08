import { useState } from "react"
import styles from "./AddPlan.module.css"

type Props = {
	add: (name: string) => void
}

export default function AddPlan({ add }: Props) {
	const [status, set_status] = useState<string>("")
	const [name, set_name] = useState<string>("")

	function handle_submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (!name) return
		add(name)
		set_name("")
		set_status("added")
		setTimeout(() => set_status(""), 1000)
	}

	return (
		<>
			<div aria-live='polite' className='sr-only'>
				{status}
			</div>

			<form onSubmit={handle_submit} className={styles.form}>
				<label
					className={`label ${styles.input_label}`}
					htmlFor='name_input'
				>
					What do you plan this week?
				</label>
				<input
					type='text'
					className={`input ${styles.name_input}`}
					id='name_input'
					autoComplete='off'
					value={name}
					onChange={(e) => set_name(e.target.value)}
				/>
				<button className='button big'>Add</button>
			</form>
		</>
	)
}
