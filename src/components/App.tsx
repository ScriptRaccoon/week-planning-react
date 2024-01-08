import { useEffect, useState } from "react"

import { Plan_Data } from "../shared/types"
import {
	add_one_week,
	get_week_end,
	get_week_start,
	key,
	remove_one_week,
} from "../shared/utils"

import Header from "./Header"
import WeekMenu from "./WeekMenu"
import AddPlan from "./AddPlan"
import Plans from "./Plans"

function App() {
	// state

	const now = new Date()
	const [week_start, set_week_start] = useState<Date>(get_week_start(now))
	const [plans, set_plans] = useState<Record<string, Plan_Data[]>>({})
	const [editing_id, set_editing_id] = useState<string | null>(null)

	const week_end = get_week_end(week_start)
	const current_plans = plans[key(week_start)] ?? []

	// effect hooks

	useEffect(() => {
		window.addEventListener("keydown", handle_keydown)

		function handle_keydown(e: KeyboardEvent) {
			if (e.key === "Escape") cancel_edit()
		}
		return () => {
			window.removeEventListener("keydown", handle_keydown)
		}
	}, [])

	// week navigation

	function increment_week(): void {
		set_week_start(add_one_week(week_start))
	}

	function decrement_week(): void {
		set_week_start(remove_one_week(week_start))
	}

	// helper functions

	function cancel_edit(): void {
		set_editing_id(null)
	}

	function update_plans(week_key: string, updated_plans: Plan_Data[]): void {
		set_plans((plans) => ({ ...plans, [week_key]: updated_plans }))
	}

	function update_plan(
		week_key: string,
		transform: (plan: Plan_Data) => Partial<Plan_Data>
	): void {
		const updated_plans = (plans[week_key] ?? []).map((plan) =>
			plan.id === editing_id ? { ...plan, ...transform(plan) } : plan
		)
		update_plans(week_key, updated_plans)
	}

	function add_plan(week_key: string, new_plan: Plan_Data): void {
		update_plans(week_key, [...(plans[week_key] ?? []), new_plan])
	}

	function delete_plan(week_key: string): void {
		const updated_plans = (plans[week_key] ?? []).filter(
			(plan) => plan.id !== editing_id
		)
		update_plans(week_key, updated_plans)
		cancel_edit()
	}

	// main functions

	function create_plan(name: string) {
		if (!name) return
		const plan: Plan_Data = {
			id: crypto.randomUUID(),
			name,
			done: false,
		}
		add_plan(key(week_start), plan)
	}

	function rename_plan(name: string): void {
		if (!name) return
		update_plan(key(week_start), () => ({ name }))
	}

	function toggle_done(): void {
		update_plan(key(week_start), (plan) => ({ done: !plan.done }))
		cancel_edit()
	}

	function move(offset: 1 | -1): void {
		if (!editing_id) return
		const plan = current_plans.find((p) => p.id === editing_id)
		if (!plan) return
		delete_plan(key(week_start))
		const action = offset === 1 ? add_one_week : remove_one_week
		const new_date = action(week_start)
		add_plan(key(new_date), plan)
		cancel_edit()
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
					delete_plan={() => delete_plan(key(week_start))}
				/>
			</main>
		</>
	)
}

export default App
