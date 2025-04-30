import schedule from "node-schedule";
import { prisma } from "@/lib/prisma";
import { checkPresence } from "@/lib/check";

const tasks = new Map();

export async function startTask() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  await stopTask("checkPresence");
  tasks.set("checkPresence", schedule.scheduleJob(`*/${user.monitorInterval} * * * *`, () => {
    checkPresence();
  }));
  checkPresence();
}

export async function stopTask(name) {
  const task = tasks.get(name);
  if (task) {
    task.cancel();
    tasks.delete(name);
  }
}
