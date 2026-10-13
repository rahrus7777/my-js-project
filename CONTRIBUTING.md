# Contributing

Report bugs with the experiment, browser version, expected output and observed output. Do not include private data or credentials.

Add experiments in lessons.js with a unique id, title, explanation, expected label order and a function taking log(label, category). Use sync, microtask or task to annotate the execution context. These annotations must be accurate; the UI does not infer them.

Keep examples deterministic, short and relevant to JavaScript developers. Avoid network calls, DOM APIs, unbounded loops or engine-specific APIs. Each label must appear once. The runner finishes after the expected number of logs.

Run node --test lessons.test.js. Then serve the directory over HTTP and check the example in a current browser, including predictions, reset, explanation and JSON export. Check narrow viewports and keyboard use. Node tests alone do not establish browser behavior.

Submit a pull request explaining the learning objective and checks performed. Avoid dependencies unless there is a clear need.
