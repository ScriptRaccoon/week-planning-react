export type Plan_Data = {
	id: string
	name: string
	done: boolean
}

export type Plan_Props = {
	editing_id: string | null
	rename_plan: (name: string) => void
	set_editing_id: (id: string | null) => void
	toggle_done: () => void
	move_to_next_week: () => void
	move_to_previous_week: () => void
	delete_plan: () => void
}
