import { useEffect, useRef } from "react"

import { PlanData } from "@/shared/types"
import { addOneWeek, key, subtractOneWeek } from "@/shared/utils"
import { useEditingID, usePlans, useWeek } from "@/shared/hooks"

import Header from "@/components/Header/Header"
import WeekMenu from "@/components/WeekMenu/WeekMenu"
import AddPlan from "@/components/AddPlan/AddPlan"
import Plans from "@/components/Plans/Plans"

function App() {
	// state

	const [weekStart, weekEnd, incrementWeek, decrementWeek] = useWeek()
	const [plans, updatePlans] = usePlans()
	const [editingID, setEditingID, cancelEditing] = useEditingID()

	const currentPlans = plans[key(weekStart)] ?? []

	const plansRef = useRef<HTMLDivElement>(null)

	// helper functions

	function updatePlan(
		weekKey: string,
		transform: (plan: PlanData) => Partial<PlanData>
	): void {
		const updatedPlans = (plans[weekKey] ?? []).map((plan) =>
			plan.id === editingID ? { ...plan, ...transform(plan) } : plan
		)
		updatePlans(weekKey, updatedPlans)
	}

	function createPlan(weekKey: string, newPlan: PlanData): void {
		updatePlans(weekKey, [...(plans[weekKey] ?? []), newPlan])
	}

	function deletePlan(): void {
		const updatedPlans = (plans[key(weekStart)] ?? []).filter(
			(plan) => plan.id !== editingID
		)
		updatePlans(key(weekStart), updatedPlans)
		cancelEditing()
	}

	// main functions

	function addPlan(name: string) {
		if (!name) return
		const plan = {
			id: crypto.randomUUID(),
			name,
			done: false,
		}
		createPlan(key(weekStart), plan)
	}

	function renamePlan(name: string): void {
		if (!name) return
		updatePlan(key(weekStart), () => ({ name }))
	}

	function toggleDone(): void {
		updatePlan(key(weekStart), (plan) => ({ done: !plan.done }))
		cancelEditing()
	}

	function movePlan(weekOffset: 1 | -1): void {
		if (!editingID) return
		const plan = currentPlans.find((p) => p.id === editingID)
		if (!plan) return

		deletePlan()

		const newDate =
			weekOffset === 1 ? addOneWeek(weekStart) : subtractOneWeek(weekStart)

		createPlan(key(newDate), plan)
		cancelEditing()
	}

	function movePlanToNextWeek(): void {
		movePlan(1)
	}

	function movePlanToPreviousWeek(): void {
		movePlan(-1)
	}

	// effect hooks

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		document.addEventListener("click", handleClick)

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") cancelEditing()
		}

		function handleClick(e: MouseEvent) {
			const isOutside = !plansRef.current?.contains(e.target as Node)
			if (editingID && isOutside) cancelEditing()
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			document.removeEventListener("click", handleClick)
		}
	}, [editingID, cancelEditing])

	return (
		<>
			<Header>Week Planner</Header>
			<main>
				<WeekMenu {...{ weekStart, weekEnd, incrementWeek, decrementWeek }} />
				<AddPlan addPlan={addPlan} />
				<Plans
					{...{
						currentPlans,
						editingID,
						setEditingID,
						renamePlan,
						toggleDone,
						movePlanToNextWeek,
						movePlanToPreviousWeek,
						deletePlan,
					}}
					ref={plansRef}
				/>
			</main>
		</>
	)
}

export default App
