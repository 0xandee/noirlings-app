import { File } from "../types";

export class FileSystem {
  root: File;

  constructor(root: File) {
    this.root = root;
  }

  flatten() {
    const flatten = (file: File, path: string, acc: File[]) => {
      if (file.type === "folder") {
        file.items?.forEach((child) =>
          flatten(child, `${path}${file.name}/`, acc)
        );
      } else {
        acc.push({ ...file, name: `${path}${file.name}` });
      }
      return acc;
    };

    return flatten(this.root, "", []);
  }

  getByPath(path: string) {
    return path
      .split("/")
      .reduce(
        (acc, current) =>
          acc.name === current
            ? acc
            : (acc.items?.find((child) => child.name === current) as File),
        this.root
      );
  }

  updateByPath(path: string, content: string) {
    const node = this.getByPath(path);
    node.content = content;
    return this;
  }
}
