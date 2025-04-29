"use client";

import { useData, API } from "@/lib/swr";

export default function Page() {
  const { data, error, isLoading } = useData(API.USERNAME);
  const { data: password, error: passwordError, isLoading: passwordLoading } = useData(API.PASSWORD);
  const { data: npsso, error: npssoError, isLoading: npssoLoading } = useData(API.NPSSO);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>获取用户名失败</div>;
  }

  return (
    <div>
      当前用户：{data?.username}
      当前密码：{password?.password}
      当前NPSSO：{npsso?.npsso}
    </div>
  );
}
