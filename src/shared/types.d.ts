export type PlanData = {
	id: string
	name: string
	done: boolean
}

export type PlanProps = {
	editing_id: string | null
	rename_plan: (name: string) => void
	set_editing_id: (id: string | null) => void
	toggle_done: () => void
	move_to_next_week: () => void
	move_to_previous_week: () => void
	delete_plan: () => void
}
