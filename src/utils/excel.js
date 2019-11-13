export function exportExcel(res){
    let fileName = res.headers['content-disposition']?res.headers["content-disposition"].split(";")[1].split("filename=")[1]:'导出表.xls';
                let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                if (window.navigator.msSaveOrOpenBlob) {
                  navigator.msSaveBlob(blob, fileName);
                } else {
                  var link = document.createElement('a');
                  link.href = window.URL.createObjectURL(blob);
                  link.download = fileName;
                  link.click();
                  window.URL.revokeObjectURL(link.href);
    }
}