import express from 'express';
import cors from 'cors';
import http from 'node:http';
import path from 'node:path';
import { hostname } from 'node:os';
import chalk from 'chalk';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import RateLimit from 'express-rate-limit';

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const PORT = process.env.PORT || 3000;

const viteDistPath = path.join(__dirname, 'dist');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.use(express.static(viteDistPath));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/uv/', express.static(uvPath));
app.use('/libcurl/', express.static(libcurlPath));
app.use('/baremux/', express.static(baremuxPath));

// Direct routes into server.js
app.get("/", (req, res) => {
    res.sendFile(path.join(viteDistPath, "index.html"));
});

// Default route to serve index.html for all other paths
app.get('*', (req, res) => {
    res.sendFile(path.join(viteDistPath, 'index.html'));
});

server.on('request', (req, res) => {
    app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    if (req.url.endsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.end();
    }
});

server.on('listening', () => {
    const address = server.address();
    const theme = chalk.hex('#8F00FF');
    const host = chalk.hex('0d52bd');
    console.log(
        chalk.bold(
            theme(
                `ZEN`
            )
        )
    );
    console.log(
        `${chalk.bold(host('Local System:'))}            http://${address.family === 'IPv6' ? [address.address] : address.address}${address.port === 80 ? '' : ':' + chalk.bold(address.port)}`
    );
    console.log(
        `${chalk.bold(host('Local System:'))}            http://localhost${address.port === 8080 ? '' : ':' + chalk.bold(address.port)}`
    );

    try {
        console.log(
            `${chalk.bold(host('On Your Network:'))}  http://${hostname()}${address.port === 8080 ? '' : ':' + chalk.bold(address.port)}`
        );
    } catch (err) {
        // can't find LAN interface
    }

    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
        console.log(
            `${chalk.bold(host('Replit:'))}           https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
        );
    }

    if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
        console.log(
            `${chalk.bold(host('Gitpod:'))}           https://${PORT}-${process.env.HOSTNAME}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`
        );
    }

    if (
        process.env.CODESPACE_NAME &&
        process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ) {
        console.log(
            `${chalk.bold(host('Github Codespaces:'))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? '' : address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
        );
    }
});

server.listen(PORT);