package interceptor

import "github.com/pocketbase/pocketbase/core"

func NotifyNewSchedules(e *core.RecordEvent) error {
	return e.Next()
}

func NotifyOutdatedSchedules(e *core.RecordEvent) error {
	return e.Next()
}