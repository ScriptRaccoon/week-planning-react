import { useEffect, useState } from "react"
import { PlanData, PlanProps } from "../types"
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
	plan: PlanData
} & PlanProps

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
	const [show_edit_container, set_show_edit_container] = useState(false)
	const [visible, set_visible] = useState(false)
	const [name, set_name] = useState<string>(plan.name)

	useEffect(() => {
		set_show_edit_container(editing_id === plan.id)
	}, [editing_id, plan.id])

	function try_rename_plan() {
		if (!name) {
			set_name(plan.name)
			return
		}
		rename_plan(name)
	}

	function toggle_edit() {
		if (show_edit_container) {
			set_visible(false)
			setTimeout(() => {
				set_editing_id(null)
			}, 120)
			return
		}
		set_editing_id(plan.id)
		setTimeout(() => {
			set_visible(true)
		}, 10)
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
						onBlur={try_rename_plan}
						aria-hidden={!show_edit_container}
						autoFocus
						value={name}
						onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
							set_name(e.target.value)
						}
					/>
				) : (
					<div className={styles.name} id={plan.id}>
						{plan.name}
					</div>
				)}
			</div>

			{show_edit_container && (
				<div
					className={classnames({
						[styles.edit_container]: true,
						[styles.visible]: visible,
					})}
				>
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
			)}
		</div>
	)
}
