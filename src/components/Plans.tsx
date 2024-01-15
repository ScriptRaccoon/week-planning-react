import type { PlanData, PlanProps } from "@/shared/types"
import Plan from "@/components/Plan"

import styles from "./Plans.module.css"

type Props = {
	currentPlans: PlanData[]
	plansRef: React.RefObject<HTMLDivElement>
} & PlanProps

export default function Plans(props: Props) {
	const { currentPlans, plansRef } = props
	return (
		<div className={styles.plans} ref={plansRef}>
			{currentPlans.map((plan) => (
				<Plan key={plan.id} plan={plan} {...props} />
			))}
		</div>
	)
}
