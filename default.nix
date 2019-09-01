let nixpkgs = import ./nix/nixpkgs.nix {}; in
nixpkgs.stdenv.mkDerivation {
    name = "game";
    buildInputs = [
        nixpkgs.blender
        nixpkgs.nodePackages.typescript
    ];
    phases = ["unpackPhase" "buildPhase" "installPhase"];
    unpackPhase = ''
        # TODO: Skip *.blend1 files.
        cp --no-preserve=mode --recursive ${./assets} assets
        cp --no-preserve=mode --recursive ${./src} src
        cp --no-preserve=mode --recursive ${./tools} tools
        cp --no-preserve=mode --recursive ${./vendor} vendor
    '';
    buildPhase = ''
        tscArguments=(
            --pretty

            --alwaysStrict

            --noFallthroughCasesInSwitch
            --noImplicitAny
            --noImplicitReturns
            --noImplicitThis
            --strictBindCallApply
            --strictFunctionTypes
            --strictNullChecks
            --strictPropertyInitialization

            --target ES6
        )
        tsc \
            "''${tscArguments[@]}" \
            --outFile game.js \
            $(find src -name '*.ts')

        blenderExport() {
            OUTPUT=$1 \
                blender \
                    $2 \
                    --background \
                    --python tools/blenderExport.py
        }
        for blend in $(find assets -name '*.blend'); do
            group=''${blend%.blend}
            mkdir $group
            blenderExport $group $blend
        done
    '';
    installPhase = ''
        mkdir $out
        mv assets $out
        cat vendor/stats.js/stats.js \
            vendor/three.js/three.js \
            vendor/three.js/MTLLoader.js \
            vendor/three.js/OBJLoader.js \
            game.js \
            > $out/game.js
        cp src/index.html $out
    '';
}
