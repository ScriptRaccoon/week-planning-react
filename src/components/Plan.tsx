import { useRef } from "react"
import { Plan_Data, Plan_Props } from "@/shared/types"
import { CSSTransition } from "react-transition-group"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faBars,
	faCheck,
	faChevronLeft,
	faChevronRight,
	faCircleCheck,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons"
import classnames from "classnames"

import styles from "./Plan.module.css"

type Props = {
	plan: Plan_Data
} & Plan_Props

export default function Plan(props: Props) {
	const {
		plan,
		editing_id,
		rename_plan,
		set_editing_id,
		toggle_done,
		move_to_next_week,
		move_to_previous_week,
		delete_plan,
	} = props

	const edit_container_ref = useRef(null)

	const show_edit_container = editing_id === plan.id

	function toggle_edit() {
		if (show_edit_container) {
			set_editing_id(null)
		} else {
			set_editing_id(plan.id)
		}
	}

	return (
		<div className={styles.container}>
			<div
				className={classnames({
					[styles.plan]: true,
					[styles.done]: plan.done,
					[styles.edit]: show_edit_container,
					[styles.opaque]:
						editing_id !== null && !show_edit_container,
				})}
			>
				<button
					aria-label='toggle edit'
					className='button'
					onClick={toggle_edit}
					aria-describedby={plan.id}
				>
					<FontAwesomeIcon icon={faBars} />
				</button>

				{show_edit_container ? (
					<input
						aria-label='name'
						type='text'
						className={styles.name}
						aria-hidden={!show_edit_container}
						value={plan.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							rename_plan(e.target.value)
						}
					/>
				) : (
					<div className={styles.name} id={plan.id}>
						{plan.name}
					</div>
				)}
			</div>

			<CSSTransition
				in={show_edit_container}
				nodeRef={edit_container_ref}
				classNames={{
					enter: styles.edit_container_enter,
					enterActive: styles.edit_container_enter_active,
					exit: styles.edit_container_exit,
					exitActive: styles.edit_container_exit_active,
				}}
				timeout={120}
				unmountOnExit
			>
				<div className={styles.edit_container} ref={edit_container_ref}>
					<button
						aria-label='toggle done'
						className={classnames({
							button: true,
							[styles.button_done]: plan.done,
						})}
						onClick={toggle_done}
					>
						<FontAwesomeIcon
							icon={plan.done ? faCircleCheck : faCheck}
						/>
					</button>

					<button
						aria-label='move to next week'
						className='button'
						onClick={move_to_next_week}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>

					<button
						aria-label='move to previous week'
						className='button'
						onClick={move_to_previous_week}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>

					<button
						aria-label='delete plan'
						className='button'
						onClick={delete_plan}
					>
						<FontAwesomeIcon icon={faTrashAlt} />
					</button>
				</div>
			</CSSTransition>
		</div>
	)
}
