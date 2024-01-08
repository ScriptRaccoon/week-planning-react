import type { PlanData, PlanProps } from "../shared/types"
import Plan from "./Plan"

import styles from "./Plans.module.css"

type Props = {
	current_plans: PlanData[]
} & PlanProps

export default function Plans(props: Props) {
	const { current_plans } = props
	return (
		<div className={styles.plans}>
			{current_plans.map((plan) => (
				<Plan key={plan.id} plan={plan} {...props} />
			))}
		</div>
	)
}
