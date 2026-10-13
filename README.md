# JS Queue Lab

A dependency-free learning tool for **JavaScript's event loop**. Predict the output, execute a real program in a fresh browser Web Worker, and compare its observed order with an explanation.

## Experiments

- Promises before timers: synchronous work, promise reactions and zero-delay timers.
- Microtasks inside microtasks: FIFO ordering and draining newly queued work.
- Where await pauses: synchronous entry and async continuation.
- The promise executor: construction versus reaction.
- Between two timers: a microtask checkpoint between timer tasks.

Every experiment includes executable source, a prediction exercise, a real execution trace, JSON export and a detailed explanation. The page also contains a guide and links to MDN and the HTML Standard.

## Who is it for?

JavaScript learners and developers investigating asynchronous callback ordering. The educational content specifically addresses JavaScript runtime behavior, rather than merely using JavaScript to build a general-purpose site.

## Run locally

No dependencies or build step. Serve the directory over HTTP, for example:

```sh
python -m http.server 8080
```

Open http://localhost:8080 in a current browser. Module workers do not work reliably from file:// URLs.

## Tests

With Node.js 20 or later:

```sh
node --test lessons.test.js
```

Tests execute the production runner in isolated Node worker threads with a small browser messaging adapter. They check actual output ordering, categories, elapsed-time validity, prediction handling and unique lesson IDs. Browser execution must also be checked because Node and browsers are different hosts.

## Implementation and limitations

- `lessons.js`: programs, explanations, expected output and prediction parsing.
- `runner.js`: executes one built-in program in a worker; no eval or user-supplied code.
- `app.js`: worker lifecycle, predictions, lesson selection and JSON export.
- Each run creates a new worker. Reset and lesson changes terminate old workers.
- No third-party scripts, analytics, accounts or backend. No input is sent to a server.
- Categories are explicit teaching annotations, not automatic engine instrumentation.
- Workers have no DOM or rendering. The lab does not model painting, Node-specific phases, network timing or arbitrary JavaScript programs.
- Timer delays are minimum delays, not exact deadlines. Elapsed times vary by environment.

## Publishing

A static site for GitHub Pages: publish the main branch, repository root. The CNAME file contains the requested JS.ORG address. Its presence does not mean the domain has been approved or activated.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Report bugs and propose experiments in GitHub issues or pull requests.

## References

- [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [HTML Standard: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

## License

MIT. See [LICENSE](LICENSE).
