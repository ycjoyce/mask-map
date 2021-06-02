set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/ycjoyce/mask-map master:gh-pages
cd -