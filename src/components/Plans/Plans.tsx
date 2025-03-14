import { forwardRef } from "react"

import type { PlanData } from "@/shared/types"
import Plan from "@/components/Plan/Plan"

import styles from "./Plans.module.css"

type Props = {
	currentPlans: PlanData[]
	editingID: string | null
	setEditingID: (id: string | null) => void
	renamePlan: (id: string, name: string) => void
	toggleDone: (id: string) => void
	movePlanToNextWeek: (id: string) => void
	movePlanToPreviousWeek: (id: string) => void
	deletePlan: (id: string) => void
}

const Plans = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const {
		currentPlans,
		editingID,
		setEditingID,
		renamePlan,
		toggleDone,
		movePlanToNextWeek,
		movePlanToPreviousWeek,
		deletePlan,
	} = props

	return (
		<div className={styles.plans} ref={ref}>
			{currentPlans.map((plan) => (
				<Plan
					key={plan.id}
					plan={plan}
					editingID={editingID}
					setEditingID={setEditingID}
					renamePlan={(name: string) => renamePlan(plan.id, name)}
					toggleDone={() => toggleDone(plan.id)}
					movePlanToNextWeek={() => movePlanToNextWeek(plan.id)}
					movePlanToPreviousWeek={() => movePlanToPreviousWeek(plan.id)}
					deletePlan={() => deletePlan(plan.id)}
				/>
			))}
		</div>
	)
})

export default Plans
