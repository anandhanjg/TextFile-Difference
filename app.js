const fs=require('fs');
const fsP=fs.promises;
const readline=require('readline').createInterface({input:process.stdin,output:process.stdout});
const readInput=(query)=>new Promise((resolve)=>{
    readline.question(query,resolve);
});
const findDifferences=async (folder1,folder2)=>{
    let deleted=[];
    let found=[];
    let modified=[];
    let folder1Files=await fsP.readdir(folder1);
    let folder2Files=await fsP.readdir(folder2);
    for(var j=0;j<folder1Files.length;j++){
        let file=folder1Files[j];
        let i=folder2Files.indexOf(file);
        if(i!=-1){
            folder2Files.splice(i,1);
            found.push(file);
            let f1=await fsP.readFile(folder1+"/"+file,"utf8");
            let f2=await fsP.readFile(folder2+"/"+file,"utf8");
            if(f1!=f2){
                modified.push(file);
            }
        }else{
            deleted.push(file);
        }
    }
    return Promise.resolve({
        new:folder2Files,
        deleted,
        found,
        modified
    });
}



(async ()=>{
    let folder1=await readInput("Enter Folder1 Path:- ");
    let folder2=await readInput("Enter Folder2 Path:- ");
    try {
      let data =  await findDifferences(folder1,folder2);
      console.log(`${data.new.length} are files created, ${data.modified} files are modified, ${data.deleted.length} files are deleted, ${data.found.length-data.modified.length} files are remain same`)
      console.table(data);
    } catch (error) {
      console.log(error.message);    
    }
    readline.close();
})();
readline.on("close",process.exit);

