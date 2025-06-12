export const readFileAsJson = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        resolve({
          ok: true,
          data: jsonData
        })
      } catch {
        resolve({
          ok: false,
          message: "JSON解析失败"
        })
      }
    }
    reader.onerror = () => {
      resolve({
        ok: false,
        message: "文件读取失败"
      })
    }
    reader.readAsText(file)
  })
}
