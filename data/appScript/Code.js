/**
 * @description execute the script once a month
 * @description this script is used to rename dataset.zip to dataset_YYYYMMDD.zip in this folder 1rL6Q7tMa0aXzJXvP9OeDWNEG4Fz7yCFc
 * make a trigger that runs this function once a month
 */

function main() {
  const folderId = "1rL6Q7tMa0aXzJXvP9OeDWNEG4Fz7yCFc";
  var folder = null;
  try {
    folder = DriveApp.getFolderById(folderId);
    console.log(folder.getName());
  } catch (e) {
    console.log(e);
  }
  const files = folder.getFiles();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = year + ("0" + month).slice(-2) + ("0" + day).slice(-2);
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    if (name === "dataset.zip") {
      file.setName(`dataset_${date}.zip`);
    }
  }
}
