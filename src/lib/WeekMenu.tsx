import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import styles from "./WeekMenu.module.css"

type Props = {
	week_start: Date
	week_end: Date
	increment_week: () => void
	decrement_week: () => void
}

export default function WeekMenu({
	week_start,
	week_end,
	increment_week,
	decrement_week,
}: Props) {
	return (
		<div className={styles.menu}>
			<h2 className={styles.title}>
				<span aria-hidden='true'>
					{week_start.toLocaleDateString()}
					&nbsp;&ndash;&nbsp;
					{week_end.toLocaleDateString()}
				</span>
				<span className='sr-only' aria-live='polite'>
					{week_start.toDateString()}
					{week_end.toDateString()}
				</span>
			</h2>

			<button
				className='button big'
				aria-label='previous week'
				onClick={decrement_week}
			>
				<FontAwesomeIcon icon={faChevronLeft} />
			</button>

			<button
				className='button big'
				aria-label='next week'
				onClick={increment_week}
			>
				<FontAwesomeIcon icon={faChevronRight} />
			</button>
		</div>
	)
}
