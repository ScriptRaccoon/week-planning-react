import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import styles from "./WeekMenu.module.css"

type Props = {
	weekStart: Date
	weekEnd: Date
	incrementWeek: () => void
	decrementWeek: () => void
}

export default function WeekMenu({
	weekStart,
	weekEnd,
	incrementWeek,
	decrementWeek,
}: Props) {
	return (
		<div className={styles.menu}>
			<h2 className={styles.title}>
				<span aria-hidden='true'>
					{weekStart.toLocaleDateString()}
					&nbsp;&ndash;&nbsp;
					{weekEnd.toLocaleDateString()}
				</span>
				<span className='sr-only' aria-live='polite'>
					{weekStart.toDateString()}
					{weekEnd.toDateString()}
				</span>
			</h2>

			<button
				className='button big'
				aria-label='previous week'
				onClick={decrementWeek}
			>
				<FontAwesomeIcon icon={faChevronLeft} />
			</button>

			<button
				className='button big'
				aria-label='next week'
				onClick={incrementWeek}
			>
				<FontAwesomeIcon icon={faChevronRight} />
			</button>
		</div>
	)
}
