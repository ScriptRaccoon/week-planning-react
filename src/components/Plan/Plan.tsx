import { useRef } from "react"
import { PlanData } from "@/shared/types"
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
	plan: PlanData
	editingID: string | null
	setEditingID: (id: string | null) => void
	renamePlan: (name: string) => void
	toggleDone: () => void
	movePlanToNextWeek: () => void
	movePlanToPreviousWeek: () => void
	deletePlan: () => void
}

export default function Plan(props: Props) {
	const {
		plan,
		editingID,
		setEditingID,
		renamePlan,
		toggleDone,
		movePlanToNextWeek,
		movePlanToPreviousWeek,
		deletePlan,
	} = props

	const editContainerRef = useRef(null)

	const showEditContainer = editingID === plan.id

	function toggleEdit() {
		setEditingID(showEditContainer ? null : plan.id)
	}

	return (
		<div className={styles.container}>
			<div
				className={classnames({
					[styles.plan]: true,
					[styles.done]: plan.done,
					[styles.edit]: showEditContainer,
					[styles.opaque]: editingID !== null && !showEditContainer,
				})}
			>
				<button
					className='button'
					onClick={toggleEdit}
					aria-label='toggle edit'
					aria-describedby={plan.id}
					aria-pressed={showEditContainer}
				>
					<FontAwesomeIcon icon={faBars} />
				</button>

				{showEditContainer ? (
					<input
						aria-label='name'
						type='text'
						className={styles.name}
						aria-hidden={!showEditContainer}
						value={plan.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							renamePlan(e.target.value)
						}
					/>
				) : (
					<div className={styles.name} id={plan.id}>
						{plan.name ? plan.name : <>&nbsp;</>}
					</div>
				)}
			</div>

			<CSSTransition
				in={showEditContainer}
				nodeRef={editContainerRef}
				classNames={{
					enter: styles.editContainerEnter,
					enterActive: styles.editContainerEnterActive,
					exit: styles.editContainerExit,
					exitActive: styles.editContainerExitActive,
				}}
				timeout={120}
				unmountOnExit
			>
				<div className={styles.editContainer} ref={editContainerRef}>
					<button
						className={classnames({
							button: true,
							[styles.buttonDone]: plan.done,
						})}
						onClick={toggleDone}
						aria-label='toggle done'
						aria-pressed={plan.done}
					>
						<FontAwesomeIcon icon={plan.done ? faCircleCheck : faCheck} />
					</button>

					<button
						aria-label='move plan to next week'
						className='button'
						onClick={movePlanToNextWeek}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>

					<button
						aria-label='move plan to previous week'
						className='button'
						onClick={movePlanToPreviousWeek}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>

					<button
						aria-label='delete plan'
						className='button'
						onClick={deletePlan}
					>
						<FontAwesomeIcon icon={faTrashAlt} />
					</button>
				</div>
			</CSSTransition>
		</div>
	)
}
