import { useRef } from "react"
import { PlanData, PlanProps } from "@/shared/types"
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
} & PlanProps

export default function Plan(props: Props) {
	const {
		plan,
		editingID,
		renamePlan,
		setEditingID,
		toggleDone,
		moveToNextWeek,
		moveToPreviousWeek,
		deletePlan,
	} = props

	const editContainerRef = useRef(null)

	const showEditContainer = editingID === plan.id

	function toggleEdit() {
		if (showEditContainer) {
			setEditingID(null)
		} else {
			setEditingID(plan.id)
		}
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
					aria-label='toggle edit'
					className='button'
					onClick={toggleEdit}
					aria-describedby={plan.id}
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
						{plan.name}
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
						aria-label='toggle done'
						className={classnames({
							button: true,
							[styles.buttonDone]: plan.done,
						})}
						onClick={toggleDone}
					>
						<FontAwesomeIcon
							icon={plan.done ? faCircleCheck : faCheck}
						/>
					</button>

					<button
						aria-label='move to next week'
						className='button'
						onClick={moveToNextWeek}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>

					<button
						aria-label='move to previous week'
						className='button'
						onClick={moveToPreviousWeek}
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
