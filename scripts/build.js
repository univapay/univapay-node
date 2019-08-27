const fs = require('fs');

const workdir = process.cwd();
const build = process.argv[2];

const stripProps = ['devDependencies', 'scripts'].concat(
    build === 'es' ? [] : ['module', 'jsnext:main', 'sideEffects'],
);

const pkgRaw = fs.readFileSync(`${workdir}/package.json`);
let pkg = JSON.parse(pkgRaw);

pkg = Object.keys(pkg).reduce((acc, key) => {
    if (!stripProps.includes(key)) {
        acc[key] = pkg[key];
    }

    if (build === 'es') {
        if (key === 'name') {
            acc[key] = `${pkg[key]}-es`;
        } else if (key === 'keywords') {
            acc[key] = pkg[key].concat(['es']);
        }
    }

    return acc;
}, {});

fs.writeFileSync(`${workdir}/${build}/package.json`, JSON.stringify(pkg, undefined, 2));
