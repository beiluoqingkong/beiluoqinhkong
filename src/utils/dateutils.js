import { format } from "path";

export function formatDate(value, args) {
  var dt = new Date(value);
  if (args == 'yyyy/M/d') {// yyyy-M-d
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let date = dt.getDate();
    return `${year}/${month}/${date}`;
  } else if (args == 'yyyy/MM/dd   HH:mm') {// yyyy-M-d H:m:s
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    let hour = dt.getHours().toString().padStart(2, '0');
    let minute = dt.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${date}\t${hour}:${minute}`;
  } else if (args == 'yyyy/MM/dd') {// yyyy-MM-dd
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${date}`;
  } else {// yyyy-MM-dd HH:mm:ss
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    let hour = dt.getHours().toString().padStart(2, '0');
    let minute = dt.getMinutes().toString().padStart(2, '0');
    let second = dt.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }
}

export function formatMinDate(value) {
  return formatDate(value, 'yyyy/MM/dd   HH:mm');
}
export function formatDayDate(value) {
  return formatDate(value, 'yyyy/MM/dd');
}