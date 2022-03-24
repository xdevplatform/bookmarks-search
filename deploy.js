const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { argv, env, exit, cwd, chdir } = process;
const simpleGit = require('simple-git');

const ErrorCode = {
  MISSING_PARAMETERS: -1,
  PATH_NOT_FOUND: -2,
  REMOTE_NOT_FOUND: -3,
  CANNOT_DEPLOY_TO_ORIGIN: -4,
  NO_NPM_EXECPATH: -5,
  EXEC_FAILED: -6,
  GIT_FAILED: -7,
  GIT_NOT_CLEAN: -8,
  UNKNOWN: -254
};

if (!env.npm_execpath) {
  console.error('❌ use yarn deploy or npm run deploy');
  exit(ErrorCode.NO_NPM_EXECPATH);
}

const npm = env.npm_execpath.match('yarn') ? 'yarn' : 'npm run';


const printUsage = () => {
  const command = env.npm_execpath.match('yarn') ? `${npm} deploy` : `${npm} run deploy`;
  console.error(`usage: ${command} git-remote`);  
}

const run = async () => {

  const git = simpleGit();
  const [,, remote] = argv;

  if (!remote) {
    printUsage();
    exit(ErrorCode.MISSING_PARAMETERS);
  }
  
  if (remote.toLowerCase() === 'origin') {
    console.error('❌ cannot deploy to origin');
    exit(ErrorCode.CANNOT_DEPLOY_TO_ORIGIN);
  }
  
  const remotes = await git.getRemotes();
  if (!remotes.find(({name}) => name === remote)) {
    console.error('❌ remote not found:', remote);
    exit(ErrorCode.REMOTE_NOT_FOUND);
  }
  
  const branchTime = new Date();
  const currentDir = cwd();
  const branchName = `deploy-${branchTime.getTime()}`;
  
  const status = await git.status();
  
  if (!status.isClean()) {
    console.error('❌ your branch is not clean. please ensure that your changes are committed, your working directory is clean, and there are no conflicts or untracked files.');
    exit(ErrorCode.GIT_NOT_CLEAN);
  }

  try {
    // 1. build (yarn build)
    console.error('Generating build…');
    execSync(`${npm} build`);
  } catch(e) {
    console.error(e);
    exit(ErrorCode.EXEC_FAILED);
  }

  try {
    // 3. create branch (git checkout; git add; git commit; 
    // 4. git push remote main --force)
    // delete branch
    console.error('Deploying…')
    await git.checkoutLocalBranch(branchName);
    await git.add('build/*');
    await git.commit(`Deploy ${branchTime.toUTCString()}`);
    await git.push([remote, `${branchName}:master`, '--force']);
    await git.checkout('main');
    await git.deleteLocalBranch(branchName, true);
    console.error('✅ Done');
    exit();
  
  } catch(e) {
    console.error(e);
    await git.checkout('main');
    await git.deleteLocalBranch(branchName, true);
    chdir(currentDir);
    exit(ErrorCode.GIT_FAILED);
  }  
}

(async () => {
  await run();
})();