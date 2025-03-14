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
	const [plans, updatePlans, updatePlan] = usePlans()
	const [editingID, setEditingID, cancelEditing] = useEditingID()

	const currentPlans = plans[key(weekStart)] ?? []

	const plansRef = useRef<HTMLDivElement>(null)

	// main functions

	function createPlan(weekKey: string, newPlan: PlanData): void {
		const updatedPlans = [...(plans[weekKey] ?? []), newPlan]
		updatePlans(weekKey, updatedPlans)
	}

	function deletePlan(id: string): void {
		const updatedPlans = currentPlans.filter((plan) => plan.id !== id)
		updatePlans(key(weekStart), updatedPlans)
		cancelEditing()
	}

	function addPlan(name: string) {
		const plan = {
			id: crypto.randomUUID(),
			name,
			done: false,
		}
		createPlan(key(weekStart), plan)
	}

	function renamePlan(id: string, name: string): void {
		updatePlan(id, key(weekStart), () => ({ name }))
	}

	function toggleDone(id: string): void {
		updatePlan(id, key(weekStart), (plan) => ({ done: !plan.done }))
		cancelEditing()
	}

	function movePlan(id: string, weekOffset: 1 | -1): void {
		const plan = currentPlans.find((p) => p.id === id)
		if (!plan) return

		deletePlan(id)

		const newDate =
			weekOffset === 1 ? addOneWeek(weekStart) : subtractOneWeek(weekStart)

		createPlan(key(newDate), plan)
		cancelEditing()
	}

	function movePlanToNextWeek(id: string): void {
		movePlan(id, 1)
	}

	function movePlanToPreviousWeek(id: string): void {
		movePlan(id, -1)
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
				<WeekMenu
					weekStart={weekStart}
					weekEnd={weekEnd}
					incrementWeek={incrementWeek}
					decrementWeek={decrementWeek}
				/>
				<AddPlan addPlan={addPlan} />
				<Plans
					currentPlans={currentPlans}
					editingID={editingID}
					setEditingID={setEditingID}
					renamePlan={renamePlan}
					toggleDone={toggleDone}
					movePlanToNextWeek={movePlanToNextWeek}
					movePlanToPreviousWeek={movePlanToPreviousWeek}
					deletePlan={deletePlan}
					ref={plansRef}
				/>
			</main>
		</>
	)
}

export default App
