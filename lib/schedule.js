import schedule from "node-schedule";
import { checkPresence } from "@/lib/check";

const tasks = new Map();

export async function startTask() {
  await stopTask("checkPresence");
  tasks.set("checkPresence", schedule.scheduleJob("*/1 * * * *", () => {
    checkPresence();
  }));
}

export async function stopTask(name) {
  const task = tasks.get(name);
  if (task) {
    task.cancel();
    tasks.delete(name);
  }
}
