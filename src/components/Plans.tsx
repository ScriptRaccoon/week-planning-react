import type { Plan_Data, Plan_Props } from "@/shared/types"
import Plan from "@/components/Plan"

import styles from "./Plans.module.css"

type Props = {
	current_plans: Plan_Data[]
} & Plan_Props

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
