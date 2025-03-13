import { useEffect, useRef, useState } from "react"

import { PlanData as PlanData } from "@/shared/types"
import { addOneWeek, getWeekEnd, getWeekStart, key, removeOneWeek } from "@/shared/utils"
import { useLocalStorage } from "@/shared/hooks"

import Header from "@/components/Header/Header"
import WeekMenu from "@/components/WeekMenu/WeekMenu"
import AddPlan from "@/components/AddPlan/AddPlan"
import Plans from "@/components/Plans/Plans"

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

	function createPlan(weekKey: string, newPlan: PlanData): void {
		updatePlans(weekKey, [...(plans[weekKey] ?? []), newPlan])
	}

	function deletePlan(): void {
		const updatedPlans = (plans[key(weekStart)] ?? []).filter(
			(plan) => plan.id !== editingID
		)
		updatePlans(key(weekStart), updatedPlans)
		cancelEdit()
	}

	// main functions

	function addPlan(name: string) {
		if (!name) return
		const plan: PlanData = {
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
		cancelEdit()
	}

	function move(offset: 1 | -1): void {
		if (!editingID) return
		const plan = currentPlans.find((p) => p.id === editingID)
		if (!plan) return
		deletePlan()
		const action = offset === 1 ? addOneWeek : removeOneWeek
		const newDate = action(weekStart)
		createPlan(key(newDate), plan)
		cancelEdit()
	}

	function moveToNextWeek(): void {
		move(1)
	}

	function moveToPreviousWeek(): void {
		move(-1)
	}

	return (
		<>
			<Header>Week Planner</Header>
			<main>
				<WeekMenu {...{ weekStart, weekEnd, incrementWeek, decrementWeek }} />
				<AddPlan addPlan={addPlan} />
				<Plans
					{...{
						currentPlans,
						plansRef,
						editingID,
						setEditingID,
						renamePlan,
						toggleDone,
						moveToNextWeek,
						moveToPreviousWeek,
						deletePlan,
					}}
					ref={plansRef}
				/>
			</main>
		</>
	)
}

export default App
