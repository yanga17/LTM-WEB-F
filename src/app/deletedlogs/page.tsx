'use client'

import { DeletedLogsModule } from "@/modules/deletedlogs/deletedLogsModule"; // for named export
// or import DeletedLogsModule from "@/modules/deletedLogs/deletedLogsModule"; -- for default export

export default function Page() {
    return <DeletedLogsModule />
}