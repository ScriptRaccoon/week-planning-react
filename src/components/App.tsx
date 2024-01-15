import { useEffect, useRef, useState } from "react"

import { PlanData as PlanData } from "@/shared/types"
import {
	addOneWeek,
	getWeekEnd,
	getWeekStart,
	key,
	removeOneWeek,
} from "@/shared/utils"
import { useLocalStorage } from "@/shared/hooks"

import Header from "@/components/Header"
import WeekMenu from "@/components/WeekMenu"
import AddPlan from "@/components/AddPlan"
import Plans from "@/components/Plans"

function App() {
	// state

	const now = new Date()
	const [weekStart, setWeekStart] = useState<Date>(getWeekStart(now))
	const [editingID, setEditingID] = useState<string | null>(null)
	const [plans, setPlans] = useLocalStorage<Record<string, PlanData[]>>(
		"plansReact",
		{}
	)

	const weekEnd = getWeekEnd(weekStart)
	const currentPlans = plans[key(weekStart)] ?? []

	const plansRef = useRef<HTMLDivElement>(null)

	// effect hooks

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		document.addEventListener("click", handleClick)

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") cancelEdit()
		}

		function handleClick(e: MouseEvent) {
			const isOutside = !plansRef.current?.contains(e.target as Node)
			if (editingID && isOutside) cancelEdit()
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			document.removeEventListener("click", handleClick)
		}
	}, [editingID])

	// week navigation

	function incrementWeek(): void {
		setWeekStart(addOneWeek(weekStart))
	}

	function decrementWeek(): void {
		setWeekStart(removeOneWeek(weekStart))
	}

	// helper functions

	function cancelEdit(): void {
		setEditingID(null)
	}

	function updatePlans(weekKey: string, updatedPlans: PlanData[]): void {
		setPlans((plans) => ({ ...plans, [weekKey]: updatedPlans }))
	}

	function updatePlan(
		weekKey: string,
		transform: (plan: PlanData) => Partial<PlanData>
	): void {
		const updatedPlans = (plans[weekKey] ?? []).map((plan) =>
			plan.id === editingID ? { ...plan, ...transform(plan) } : plan
		)
		updatePlans(weekKey, updatedPlans)
	}

	function addPlan(weekKey: string, newPlan: PlanData): void {
		updatePlans(weekKey, [...(plans[weekKey] ?? []), newPlan])
	}

	function deletePlan(weekKey: string): void {
		const updatedPlans = (plans[weekKey] ?? []).filter(
			(plan) => plan.id !== editingID
		)
		updatePlans(weekKey, updatedPlans)
		cancelEdit()
	}

	// main functions

	function createPlan(name: string) {
		if (!name) return
		const plan: PlanData = {
			id: crypto.randomUUID(),
			name,
			done: false,
		}
		addPlan(key(weekStart), plan)
	}

	function renamePlan(name: string): void {
		if (!name) return
		updatePlan(key(weekStart), () => ({ name }))
	}

	function toggleDone(): void {
		updatePlan(key(weekStart), (plan) => ({ done: !plan.done }))
		cancelEdit()
	}

	function move(offset: 1 | -1): void {
		if (!editingID) return
		const plan = currentPlans.find((p) => p.id === editingID)
		if (!plan) return
		deletePlan(key(weekStart))
		const action = offset === 1 ? addOneWeek : removeOneWeek
		const newDate = action(weekStart)
		addPlan(key(newDate), plan)
		cancelEdit()
	}

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
				<AddPlan add={createPlan} />
				<Plans
					currentPlans={currentPlans}
					plansRef={plansRef}
					editingID={editingID}
					setEditingID={setEditingID}
					renamePlan={renamePlan}
					toggleDone={toggleDone}
					moveToNextWeek={() => move(1)}
					moveToPreviousWeek={() => move(-1)}
					deletePlan={() => deletePlan(key(weekStart))}
				/>
			</main>
		</>
	)
}

export default App
