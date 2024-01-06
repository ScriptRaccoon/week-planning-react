import { useEffect, useState } from "react"

import { PlanData } from "./types"
import {
	add_one_week,
	get_week_end,
	get_week_start,
	key,
	remove_one_week,
} from "./utils"

import Header from "./lib/Header"
import WeekMenu from "./lib/WeekMenu"
import AddPlan from "./lib/AddPlan"
import Plans from "./lib/Plans"

function App() {
	const now = new Date()
	const [week_start, set_week_start] = useState<Date>(get_week_start(now))
	const [week_end, set_week_end] = useState<Date>(get_week_end(week_start))
	const [plans, set_plans] = useState<Record<string, PlanData[]>>({})
	const [current_plans, set_current_plans] = useState<PlanData[]>([])
	const [editing_id, set_editing_id] = useState<string | null>(null)

	useEffect(() => {
		window.addEventListener("keydown", handle_keydown)

		function handle_keydown(e: KeyboardEvent) {
			if (e.key === "Escape") cancel_edit()
		}
		return () => {
			window.removeEventListener("keydown", handle_keydown)
		}
	}, [])

	useEffect(() => {
		set_week_end(get_week_end(week_start))
	}, [week_start])

	useEffect(() => {
		set_current_plans(plans[key(week_start)] ?? [])
	}, [week_start, plans])

	function increment_week() {
		set_week_start(add_one_week(week_start))
	}

	function decrement_week() {
		set_week_start(remove_one_week(week_start))
	}

	function create_plan(name: string) {
		if (!name) return
		const plan: PlanData = {
			id: crypto.randomUUID(),
			name,
			done: false,
		}
		set_plans((plans) => {
			const existing_plans = plans[key(week_start)] ?? []
			const updated_plans = [...existing_plans, plan]
			return { ...plans, [key(week_start)]: updated_plans }
		})
	}

	function rename_plan(name: string): void {
		if (!name) return
		const existing_plans = plans[key(week_start)] ?? []
		const updated_plans = existing_plans.map((plan) => {
			if (plan.id === editing_id) {
				return { ...plan, name }
			}
			return plan
		})
		set_plans((plans) => {
			return { ...plans, [key(week_start)]: updated_plans }
		})
	}

	function cancel_edit(): void {
		set_editing_id(null)
	}

	function toggle_done(): void {
		const existing_plans = plans[key(week_start)] ?? []
		const updated_plans = existing_plans.map((plan) => {
			if (plan.id === editing_id) {
				return { ...plan, done: !plan.done }
			}
			return plan
		})
		set_plans((plans) => {
			return { ...plans, [key(week_start)]: updated_plans }
		})
		cancel_edit()
	}

	function move(offset: 1 | -1): void {
		if (!editing_id) return
		const plan = current_plans.find((p) => p.id === editing_id)
		if (!plan) return

		const existing_plans = plans[key(week_start)] ?? []
		const updated_plans = existing_plans.filter((p) => p.id != editing_id)
		set_plans((plans) => {
			return { ...plans, [key(week_start)]: updated_plans }
		})

		const action = offset === 1 ? add_one_week : remove_one_week
		const new_date = action(week_start)

		const other_plans = plans[key(new_date)] ?? []
		const new_plans = [...other_plans, plan]
		set_plans((plans) => {
			return { ...plans, [key(new_date)]: new_plans }
		})

		cancel_edit()
	}

	function delete_plan(): void {
		set_plans((previous_plans) => {
			const copy = { ...previous_plans }
			copy[key(week_start)] = copy[key(week_start)].filter(
				(plan) => plan.id !== editing_id
			)
			return copy
		})
	}

	return (
		<>
			<Header />
			<main>
				<WeekMenu
					week_start={week_start}
					week_end={week_end}
					increment_week={increment_week}
					decrement_week={decrement_week}
				/>
				<AddPlan add={create_plan} />
				<Plans
					current_plans={current_plans}
					editing_id={editing_id}
					set_editing_id={set_editing_id}
					rename_plan={rename_plan}
					toggle_done={toggle_done}
					move_to_next_week={() => move(1)}
					move_to_previous_week={() => move(-1)}
					delete_plan={delete_plan}
				/>
			</main>
		</>
	)
}

export default App
