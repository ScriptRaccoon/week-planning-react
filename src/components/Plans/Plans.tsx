import { forwardRef } from "react"

import type { PlanData } from "@/shared/types"
import Plan from "@/components/Plan/Plan"

import styles from "./Plans.module.css"

type Props = {
	currentPlans: PlanData[]
	editingID: string | null
	setEditingID: (id: string | null) => void
	renamePlan: (name: string) => void
	toggleDone: () => void
	movePlanToNextWeek: () => void
	movePlanToPreviousWeek: () => void
	deletePlan: () => void
}

const Plans = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { currentPlans, ...rest } = props
	return (
		<div className={styles.plans} ref={ref}>
			{currentPlans.map((plan) => (
				<Plan key={plan.id} plan={plan} {...rest} />
			))}
		</div>
	)
})

export default Plans
