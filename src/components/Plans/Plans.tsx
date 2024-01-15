import { forwardRef } from "react"

import type { PlanData, PlanProps } from "@/shared/types"
import Plan from "@/components/Plan/Plan"

import styles from "./Plans.module.css"

type Props = {
	currentPlans: PlanData[]
} & PlanProps

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
