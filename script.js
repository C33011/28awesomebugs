document.addEventListener("DOMContentLoaded", () => {
    const bugs = Array.from(document.querySelectorAll(".bug"));
    const gravityButton = document.getElementById("toggle-gravity");
    const freezeButton = document.getElementById("toggle-freeze");
    const spinButton = document.getElementById("toggle-spin");

    let gravityEnabled = true;
    let animationRunning = true;

    const bugData = bugs.map((bug) => ({
        element: bug,
        x: Math.random() * (window.innerWidth - 50),
        y: Math.random() * (window.innerHeight - 50),
        dx: (Math.random() - 0.5) * 5,
        dy: (Math.random() - 0.5) * 5,
        mass: 1,
        radius: bug.offsetWidth / 2,
        drag: 0.995,
    }));

    function updatePositions() {
        if (!animationRunning) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        bugData.forEach((bug) => {
            // Update position
            bug.x += bug.dx;
            bug.y += bug.dy;

            // Apply gravity
            if (gravityEnabled) {
                const gravityForce = 0.1;
                bug.dy += gravityForce;
                bug.dx *= bug.drag;
                bug.dy *= bug.drag;
            }

            // Collision with walls
            if (bug.x < 0) {
                bug.x = 0;
                bug.dx *= -1;
            } else if (bug.x + bug.radius * 2 > viewportWidth) {
                bug.x = viewportWidth - bug.radius * 2;
                bug.dx *= -1;
            }

            if (bug.y < 0) {
                bug.y = 0;
                bug.dy *= -1;
            } else if (bug.y + bug.radius * 2 > viewportHeight) {
                bug.y = viewportHeight - bug.radius * 2;
                bug.dy *= -1;
            }

            // Update DOM position
            bug.element.style.transform = `translate(${bug.x}px, ${bug.y}px)`;
        });

        requestAnimationFrame(updatePositions);
    }

    function handleBugCollision(bug, otherBug) {
        const dx = bug.x - otherBug.x;
        const dy = bug.y - otherBug.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bug.radius * 2) {
            const nx = dx / distance;
            const ny = dy / distance;

            const relativeVelocityX = bug.dx - otherBug.dx;
            const relativeVelocityY = bug.dy - otherBug.dy;
            const dotProduct = relativeVelocityX * nx + relativeVelocityY * ny;

            if (dotProduct > 0) return;

            const coefficientOfRestitution = 0.9;
            const impulse = (2 * dotProduct) / (bug.mass + otherBug.mass);

            bug.dx -= impulse * otherBug.mass * nx * coefficientOfRestitution;
            bug.dy -= impulse * otherBug.mass * ny * coefficientOfRestitution;

            otherBug.dx += impulse * bug.mass * nx * coefficientOfRestitution;
            otherBug.dy += impulse * bug.mass * ny * coefficientOfRestitution;

            const overlap = bug.radius * 2 - distance;
            const correction = overlap / 2;

            bug.x += nx * correction;
            bug.y += ny * correction;

            otherBug.x -= nx * correction;
            otherBug.y -= ny * correction;
        }
    }

    gravityButton.addEventListener("click", () => {
        gravityEnabled = !gravityEnabled;
        gravityButton.textContent = gravityEnabled ? "Turn Off Gravity" : "Turn On Gravity";
    });

    freezeButton.addEventListener("click", () => {
        animationRunning = !animationRunning;
        freezeButton.textContent = animationRunning ? "Freeze Bugs" : "Unfreeze Bugs";

        if (animationRunning) {
            requestAnimationFrame(updatePositions);
        }
    });

    spinButton.addEventListener("mousedown", () => {
        bugData.forEach(bug => {
            bug.dx = (Math.random() - 0.5) * 2000; // Random velocity x
            bug.dy = (Math.random() - 0.5) * 2000; // Random velocity y
        });
    });

    // Add "Explode a Bug" button dynamically
    const buttonTray = document.querySelector(".button-tray");
    const explodeBugButton = document.createElement("button");
    explodeBugButton.textContent = "Explode a Bug";
    buttonTray.appendChild(explodeBugButton);

    explodeBugButton.addEventListener("click", () => {
        const remainingBugs = document.querySelectorAll(".bug");

        if (remainingBugs.length > 0) {
            // Choose a random bug
            const bug = remainingBugs[Math.floor(Math.random() * remainingBugs.length)];

            // Create explosion effect
            const explosion = document.createElement("img");
            explosion.src = "coolexplosion.gif"; 
            explosion.style.position = "absolute";
            explosion.style.width = `${bug.offsetWidth * 1.5}px`;
            explosion.style.height = `${bug.offsetHeight * 1.5}px`;
            explosion.style.pointerEvents = "none";
            explosion.style.top = `${bug.getBoundingClientRect().top}px`;
            explosion.style.left = `${bug.getBoundingClientRect().left}px`;
            explosion.style.transform = "translate(-50%, -50%)";

            // Add explosion sound
            const explosionSound = new Audio("deltarune-explosion.mp3"); 
            explosionSound.volume = 0.25; // Adjust volume
            explosionSound.play();

            // Append explosion and remove bug
            const bugsContainer = document.querySelector(".bugs-container");
            bugsContainer.appendChild(explosion);
            bug.remove();

            // Clean up explosion effect
            setTimeout(() => explosion.remove(), 1500);
        } else {
            alert("No more bugs to explode! You monster :(");
        }
    });

    // Add "Spawn a Bug" button dynamically
    const spawnBugButton = document.createElement("button");
    spawnBugButton.textContent = "Spawn a Bug";
    buttonTray.appendChild(spawnBugButton);

    spawnBugButton.addEventListener("click", () => {
        const bugImages = ["bug1.png", "bug2.jpeg", "bug3.jpg", "bug4.jpeg", "bug5.jpg", "bug6.jpeg", "bug7.jpg", "bug8.jpg", "bug10.jpg", "bug11.jpg","bug12.jpg", "bug13.jpg", "bug14.jpg", "bug15.jpg", "bug16.jpg", "bug17.jpg", "bug18.jpg", "bug19.jpg"]; // Replace with actual bug image paths
        const randomImage = bugImages[Math.floor(Math.random() * bugImages.length)];

        const newBug = document.createElement("img");
        newBug.src = randomImage;
        newBug.classList.add("bug");
        newBug.style.position = "absolute";
        newBug.style.width = "50px";
        newBug.style.height = "50px";
        newBug.style.pointerEvents = "none";
        newBug.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
        newBug.style.left = `${Math.random() * (window.innerWidth - 50)}px`;

        const bugsContainer = document.querySelector(".bugs-container");
        bugsContainer.appendChild(newBug);

        // Add to bugData
        bugData.push({
            element: newBug,
            x: parseFloat(newBug.style.left),
            y: parseFloat(newBug.style.top),
            dx: (Math.random() - 0.5) * 5,
            dy: (Math.random() - 0.5) * 5,
            mass: 1,
            radius: 25, // Half of 50px width
            drag: 0.995,
        });
    });

    requestAnimationFrame(updatePositions);
});
